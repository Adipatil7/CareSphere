package com.caresphere.consultation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignalMessage {

    private String roomId;
    private String senderId;
    private String type;   // offer | answer | ice
    private String payload; // JSON string
}
