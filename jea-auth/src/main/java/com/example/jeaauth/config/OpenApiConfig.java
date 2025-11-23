package com.example.jeaauth.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API - BiblioTech: Gestión de Usuarios y Autenticación")
                        .version("1.0.0")
                        .description("Microservicio encargado de la administración de usuarios, roles y autenticación del sistema BiblioTech.")
                        .contact(new Contact()
                                .name("José Manuel Quispe Condori")
                                .email("tupapijosequispe901@gmail.com")
                                .url("https://bibliotech.com")
                        )
                );
    }
}
