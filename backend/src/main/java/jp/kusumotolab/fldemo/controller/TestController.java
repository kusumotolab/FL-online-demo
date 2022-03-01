package jp.kusumotolab.fldemo.controller;

import java.util.List;
import jp.kusumotolab.fldemo.data.SrcAndTests;
import jp.kusumotolab.fldemo.data.TestResultWithCoverage;
import jp.kusumotolab.fldemo.service.KgenprogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/test")
@Scope("request")
public class TestController {

  @Autowired private KgenprogService kgenprogService;

  @PostMapping
  @ResponseBody
  public List<TestResultWithCoverage> execTests(@RequestBody SrcAndTests st) {
    return kgenprogService.execTests(st);
  }
}
