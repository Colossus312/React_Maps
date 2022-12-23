package com.reactdemo.maps.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class test {
    @Id

    String id;
    String category;
    String title;
    String company;
    String content;
}
