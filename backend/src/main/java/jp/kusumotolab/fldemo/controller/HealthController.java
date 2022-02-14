package jp.kusumotolab.fldemo.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

  @RequestMapping("/health")
  public void health() {
    //returns 200 OK
  }

}
