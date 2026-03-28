package com.caresphere.pharmacy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PharmacyServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PharmacyServiceApplication.class, args);
    }
}
