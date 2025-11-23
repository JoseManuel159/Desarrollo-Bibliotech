package com.example.jeaauth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class JeaAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(JeaAuthApplication.class, args);
    }

}
