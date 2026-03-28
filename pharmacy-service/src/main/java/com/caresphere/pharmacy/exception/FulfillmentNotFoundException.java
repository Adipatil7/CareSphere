package com.caresphere.pharmacy.exception;

public class FulfillmentNotFoundException extends RuntimeException {
    public FulfillmentNotFoundException(String message) {
        super(message);
    }
}
