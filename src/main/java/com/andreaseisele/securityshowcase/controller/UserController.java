package com.andreaseisele.securityshowcase.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    @GetMapping("/loggedIn")
    public Map<String, Boolean> isLoggedIn(@AuthenticationPrincipal User user) throws InterruptedException {
        //Thread.sleep(10 * 1000);
        return Map.of("loggedIn", user != null);
    }

}
