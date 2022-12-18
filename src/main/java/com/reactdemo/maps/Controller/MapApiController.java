package com.reactdemo.maps.Controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MapApiController {

    @GetMapping("/api/hello")
    public String test() {
        return "Hello, world!";
    }

}