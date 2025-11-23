package com.example.jeaauth.service;


import com.example.jeaauth.dto.AuthResponseDto;
import com.example.jeaauth.dto.AuthUserDto;
import com.example.jeaauth.dto.TokenDto;
import com.example.jeaauth.entity.AuthUser;

public interface AuthUserService {
    public AuthUser save(AuthUserDto authUserDto);

    public AuthResponseDto login(AuthUserDto authUserDto);

    public TokenDto validate(String token);
}
