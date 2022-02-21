package jp.kusumotolab.fldemo.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("health")
public class HealthController {

  @GetMapping
  public void health() {
    //returns 200 OK
  }

}
