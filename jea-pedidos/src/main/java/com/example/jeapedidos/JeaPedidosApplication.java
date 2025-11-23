package com.example.jeapedidos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class JeaPedidosApplication {

    public static void main(String[] args) {
        SpringApplication.run(JeaPedidosApplication.class, args);
    }

}
