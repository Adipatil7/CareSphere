package com.caresphere.appointment.exception;

public class OverlappingAppointmentException extends RuntimeException {

    public OverlappingAppointmentException(String message) {
        super(message);
    }
}
