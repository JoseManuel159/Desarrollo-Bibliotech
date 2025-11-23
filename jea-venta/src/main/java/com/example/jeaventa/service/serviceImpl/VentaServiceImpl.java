package com.example.jeaventa.service.serviceImpl;

import com.example.jeaventa.dto.*;
import com.example.jeaventa.entity.Venta;
import com.example.jeaventa.entity.VentaDetalle;
import com.example.jeaventa.feign.ClienteFeign;
import com.example.jeaventa.feign.FormaPagoFeign;
import com.example.jeaventa.feign.ProductoFeign;
import com.example.jeaventa.repository.VentaDetalleRepository;
import com.example.jeaventa.repository.VentaRepository;
import com.example.jeaventa.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VentaServiceImpl implements VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ClienteFeign clienteFeign;

    @Autowired
    private ProductoFeign productoFeign;

    @Autowired
    private FormaPagoFeign formaPagoFeign;

    @Autowired
    private VentaDetalleRepository ventaDetalleRepository;

    @Override
    public List<ProductoMasVendidoDTO> obtenerTop10ProductosVendidos() {
        Pageable top10 = PageRequest.of(0, 10);
        List<Object[]> resultados = ventaDetalleRepository.obtenerTopProductosVendidos(top10);

        List<ProductoMasVendidoDTO> lista = new ArrayList<>();

        for (Object[] fila : resultados) {
            Long productoId = (Long) fila[0];
            Double cantidad = (Double) fila[1];

            ResponseEntity<Producto> response = productoFeign.listarProducto(productoId);
            String nombre = response.getBody() != null ? response.getBody().getNombre() : "Desconocido";

            lista.add(new ProductoMasVendidoDTO(productoId, nombre, cantidad));
        }

        return lista;
    }


    private Venta cargarVentaCompleta(Venta venta) {
        // Obtener y setear el cliente
        Cliente cliente = clienteFeign.listarcliente(venta.getClienteId()).getBody();
        venta.setCliente(cliente);

        // Obtener y setear los productos de los detalles
        List<VentaDetalle> detalles = venta.getDetalle().stream().map(detalle -> {
            Producto producto = productoFeign.listarProducto(detalle.getProductoId()).getBody();
            detalle.setProducto(producto);
            return detalle;
        }).collect(Collectors.toList());
        venta.setDetalle(detalles);

        // Obtener y setear la forma de pago
        FormaPago formaPago = formaPagoFeign.obtenerFormaPago(venta.getFormapagoId()).getBody();
        venta.setFormaPago(formaPago);

        return venta;
    }


    @Override
    public Venta createVenta(Venta venta) {

        if (venta.getDescripcion() == null || venta.getDescripcion().trim().isEmpty()) {
            venta.setDescripcion("Gracias por su compra");
        }

        for (VentaDetalle detalle : venta.getDetalle()) {
            Long productoId = detalle.getProductoId();
            Double cantidadVendida = detalle.getCantidad();

            ResponseEntity<Producto> response = productoFeign.listarProducto(productoId);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Producto producto = response.getBody();

                if (!producto.isEstado()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto con ID " + productoId + " no está activo.");
                }

                if (producto.getCantidad() < cantidadVendida.intValue()) {
                    throw new RuntimeException("Stock insuficiente para el producto con ID " + productoId + ".");
                }

                // Asignar precio correcto antes de guardar
                detalle.setPrecio(producto.getPrecioVenta());

                // Restar stock
                int nuevaCantidad = producto.getCantidad() - cantidadVendida.intValue();
                productoFeign.actualizarCantidad(productoId, nuevaCantidad);

            } else {
                throw new RuntimeException("Producto con ID " + productoId + " no encontrado al registrar venta.");
            }
        }

        // Ahora que los precios están asignados, la llamada a save dispara @PrePersist que calcula totales y serie/numero
        Venta nuevaVenta = ventaRepository.save(venta);

        return nuevaVenta;
    }


    @Override
    public List<Venta> getAllVentas() {
        return ventaRepository.findAll();
    }

    @Override
    public Optional<Venta> getVentaById(Integer id) {
        Venta venta = ventaRepository.findById(id).orElse(null);

        if (venta == null) return Optional.empty();

        Cliente cliente = clienteFeign.listarcliente(venta.getClienteId()).getBody();
        venta.setCliente(cliente);

        List<VentaDetalle> detalles = venta.getDetalle().stream().map(detalle -> {
            Producto producto = productoFeign.listarProducto(detalle.getProductoId()).getBody();
            detalle.setProducto(producto);
            return detalle;
        }).collect(Collectors.toList());

        FormaPago formaPago = formaPagoFeign.obtenerFormaPago(venta.getFormapagoId()).getBody();
        venta.setFormaPago(formaPago);

        venta.setDetalle(detalles);
        return Optional.of(venta);
    }

    @Override
    public Venta updateVenta(Integer id, Venta venta) {
        return ventaRepository.save(venta);
    }

    @Override
    public void deleteVenta(Integer id) {
        ventaRepository.deleteById(id);
    }



    @Override
    public List<Venta> buscarPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        List<Venta> ventas = ventaRepository.findByFechaVentaBetween(inicio, fin);

        return ventas.stream().map(venta -> {
            // Cliente
            Cliente cliente = clienteFeign.listarcliente(venta.getClienteId()).getBody();
            venta.setCliente(cliente);

            // Detalles con producto
            List<VentaDetalle> detalles = venta.getDetalle().stream().map(detalle -> {
                Producto producto = productoFeign.listarProducto(detalle.getProductoId()).getBody();
                detalle.setProducto(producto);
                return detalle;
            }).collect(Collectors.toList());
            venta.setDetalle(detalles);

            // Forma de pago
            FormaPago formaPago = formaPagoFeign.obtenerFormaPago(venta.getFormapagoId()).getBody();
            venta.setFormaPago(formaPago);

            return venta;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Venta> buscarPorSerie(String serie) {
        return ventaRepository.findBySerie(serie)
                .stream()
                .map(this::cargarVentaCompleta)
                .collect(Collectors.toList());
    }

    @Override
    public List<Venta> buscarPorNumero(String numero) {
        return ventaRepository.findByNumero(numero)
                .stream()
                .map(this::cargarVentaCompleta)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Venta> buscarPorSerieYNumero(String serie, String numero) {
        return ventaRepository.findBySerieAndNumero(serie, numero)
                .map(this::cargarVentaCompleta);
    }


    public List<VentaPorMesDTO> obtenerVentasPorMes() {
        List<Object[]> resultados = ventaRepository.ventasPorMes();

        return resultados.stream().map(obj -> {
            Integer mes = (Integer) obj[0];
            Double total = (Double) obj[1];

            String nombreMes = Month.of(mes).getDisplayName(TextStyle.FULL, new Locale("es", "ES"));

            return new VentaPorMesDTO(nombreMes, total);
        }).collect(Collectors.toList());
    }

    @Override
    public Double obtenerTotalVentas() {
        return ventaRepository.obtenerTotalVentas() != null ? ventaRepository.obtenerTotalVentas() : 0.0;
    }


}