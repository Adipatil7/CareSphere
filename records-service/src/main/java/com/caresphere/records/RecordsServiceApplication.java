package com.caresphere.records;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RecordsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecordsServiceApplication.class, args);
    }
}
