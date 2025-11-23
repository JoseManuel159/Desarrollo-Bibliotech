package com.example.jeaauth.dto;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class TokenDto {
    private String token;

    public TokenDto() {
    }

    public TokenDto(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

