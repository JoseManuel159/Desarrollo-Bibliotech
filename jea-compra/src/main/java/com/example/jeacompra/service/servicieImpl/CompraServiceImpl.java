package com.example.jeacompra.service.servicieImpl;

import com.example.jeacompra.dto.FormaPago;
import com.example.jeacompra.dto.Producto;
import com.example.jeacompra.dto.Proveedor;
import com.example.jeacompra.entity.Compra;
import com.example.jeacompra.entity.CompraDetalle;
import com.example.jeacompra.feign.FormaPagoFeign;
import com.example.jeacompra.feign.ProductoFeign;
import com.example.jeacompra.feign.ProveedorFeign;
import com.example.jeacompra.repository.CompraRepository;
import com.example.jeacompra.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompraServiceImpl implements CompraService {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private ProductoFeign productoFeign;

    @Autowired
    private FormaPagoFeign formaPagoFeign;

    @Autowired
    private ProveedorFeign proveedorFeign;


    @Override
    public Compra createCompra(Compra compra) {
        if (compra.getDescripcion() == null || compra.getDescripcion().trim().isEmpty()) {
            compra.setDescripcion("Compra registrada");
        }

        Long proveedorId = compra.getProveedorId();
        ResponseEntity<Proveedor> proveedorResponse = proveedorFeign.obtenerproveedor(proveedorId);

        if (!proveedorResponse.getStatusCode().is2xxSuccessful() || proveedorResponse.getBody() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Proveedor con ID " + proveedorId + " no encontrado.");
        }

        Proveedor proveedor = proveedorResponse.getBody();

        if (!Boolean.TRUE.equals(proveedor.getEstado())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El proveedor con ID " + proveedorId + " está inactivo.");
        }


        for (CompraDetalle detalle : compra.getDetalle()) {
            Long productoId = detalle.getProductoId();
            Double cantidadComprada = detalle.getCantidad();

            // Obtener información del producto desde el microservicio
            ResponseEntity<Producto> response = productoFeign.listarProducto(productoId);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Producto producto = response.getBody();

                if (!producto.isEstado()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto con ID " + productoId + " está inactivo.");
                }


                detalle.setPrecio(producto.getCostoCompra());

                // Actualizar el stock sumando la cantidad comprada
                int nuevaCantidad = producto.getCantidad() + cantidadComprada.intValue();
                productoFeign.actualizarCantidad(productoId, nuevaCantidad);

            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto con ID " + productoId + " no encontrado al registrar compra.");
            }
        }

        // Guardar la compra después de procesar los detalles
        Compra nuevaCompra = compraRepository.save(compra);

        return nuevaCompra;
    }


    @Override
    public List<Compra> getAllCompra() {
        List<Compra> compras = compraRepository.findAll();
        
        return compras.stream()
                .map(this::cargarCompraCompleta)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Compra> getCompraById(Long id) {
        Compra compra = compraRepository.findById(id).orElse(null);

        if (compra == null) return Optional.empty();


        List<CompraDetalle> detalles = compra.getDetalle().stream().map(detalle -> {
            Producto producto = productoFeign.listarProducto(detalle.getProductoId()).getBody();
            detalle.setProducto(producto);
            return detalle;
        }).collect(Collectors.toList());

        FormaPago formaPago = formaPagoFeign.obtenerFormaPago(compra.getFormapagoId()).getBody();
        compra.setFormaPago(formaPago);

        compra.setDetalle(detalles);

        ResponseEntity<Proveedor> proveedorResponse = proveedorFeign.obtenerproveedor(compra.getProveedorId());
        if (proveedorResponse.getStatusCode().is2xxSuccessful() && proveedorResponse.getBody() != null) {
            compra.setProveedor(proveedorResponse.getBody());
        }

        return Optional.of(compra);
    }

    @Override
    public Compra updateCompra(Long id, Compra compra) {
        return compraRepository.save(compra);
    }

    @Override
    public void deleteCompra(Long id) {
        compraRepository.deleteById(id);
    }

    private Compra cargarCompraCompleta(Compra compra) {
        // Obtener y setear los productos de los detalles
        List<CompraDetalle> detalles = compra.getDetalle().stream().map(detalle -> {
            Producto producto = productoFeign.listarProducto(detalle.getProductoId()).getBody();
            detalle.setProducto(producto);
            return detalle;
        }).collect(Collectors.toList());
        compra.setDetalle(detalles);

        // Obtener y setear la forma de pago
        FormaPago formaPago = formaPagoFeign.obtenerFormaPago(compra.getFormapagoId()).getBody();
        compra.setFormaPago(formaPago);

        ResponseEntity<Proveedor> proveedorResponse = proveedorFeign.obtenerproveedor(compra.getProveedorId());
        if (proveedorResponse.getStatusCode().is2xxSuccessful() && proveedorResponse.getBody() != null) {
            compra.setProveedor(proveedorResponse.getBody());
        }


        return compra;
    }


    @Override
    public List<Compra> buscarPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        List<Compra> compras = compraRepository.findByFechaCompraBetween(inicio, fin);

        return compras.stream()
                .map(this::cargarCompraCompleta)
                .collect(Collectors.toList());
    }

    @Override
    public List<Compra> buscarPorSerie(String serie) {
        return compraRepository.findBySerie(serie)
                .stream()
                .map(this::cargarCompraCompleta)
                .collect(Collectors.toList());
    }

    @Override
    public List<Compra> buscarPorNumero(String numero) {
        return compraRepository.findByNumero(numero)
                .stream()
                .map(this::cargarCompraCompleta)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Compra> buscarPorSerieYNumero(String serie, String numero) {
        return compraRepository.findBySerieAndNumero(serie, numero)
                .map(this::cargarCompraCompleta);
    }
}