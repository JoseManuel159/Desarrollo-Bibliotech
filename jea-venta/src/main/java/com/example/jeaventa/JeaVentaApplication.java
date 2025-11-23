package com.example.jeaventa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class JeaVentaApplication {

    public static void main(String[] args) {
        SpringApplication.run(JeaVentaApplication.class, args);
    }

}
