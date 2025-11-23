package com.example.jeaauth.dto;

import java.util.List;

public class AuthResponseDto {
    private String token;
    private String userName;
    private List<AccesoDto> accesos;

    public AuthResponseDto(String token, String userName, List<AccesoDto> accesos) {
        this.token = token;
        this.userName = userName;
        this.accesos = accesos;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<AccesoDto> getAccesos() {
        return accesos;
    }

    public void setAccesos(List<AccesoDto> accesos) {
        this.accesos = accesos;
    }
}
