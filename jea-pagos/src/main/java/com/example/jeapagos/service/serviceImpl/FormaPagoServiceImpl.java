package com.example.jeapagos.service.serviceImpl;

import com.example.jeapagos.entity.FormaPago;
import com.example.jeapagos.repository.FormaPagoRepository;
import com.example.jeapagos.service.FormaPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FormaPagoServiceImpl implements FormaPagoService {

    @Autowired
    private FormaPagoRepository formaPagoRepository;

    @Override
    public List<FormaPago> listarFormasPago() {
        return formaPagoRepository.findAll();
    }

    @Override
    public FormaPago guardar(FormaPago formaPago) {
        return formaPagoRepository.save(formaPago);
    }

    @Override
    public Optional<FormaPago> buscarPorId(Long id) {
        return formaPagoRepository.findById(id);
    }

    @Override
    public FormaPago actualizar(Long id, FormaPago formaPago) {
        return formaPagoRepository.findById(id).map(fp -> {
            fp.setNombre(formaPago.getNombre());
            return formaPagoRepository.save(fp);
        }).orElseThrow(() -> new RuntimeException("Forma de pago no encontrada con id: " + id));
    }

    @Override
    public void eliminar(Long id) {
        formaPagoRepository.deleteById(id);
    }
}