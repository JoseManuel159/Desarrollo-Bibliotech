package com.example.jeaconfigserver;

import jdk.jfr.Enabled;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class JeaConfigServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(JeaConfigServerApplication.class, args);
	}

}
