package jp.kusumotolab.fldemo.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/health")
@Tag(name = "Health", description = "For alive monitoring")
public class HealthController {

  @GetMapping
  public void health() {
    // returns 200 OK
  }
}
