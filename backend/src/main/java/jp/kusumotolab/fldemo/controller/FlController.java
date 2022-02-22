package jp.kusumotolab.fldemo.controller;

import java.util.Map;
import jp.kusumotolab.fldemo.common.FlResult;
import jp.kusumotolab.fldemo.model.SrcAndTests;
import jp.kusumotolab.fldemo.service.KgenprogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/fl")
@Scope("request")
public class FlController {

  @Autowired
  private KgenprogService kgenprogService;

  @PostMapping("all")
  @ResponseBody
  public Map<String, FlResult> flAll(
      @RequestBody
          SrcAndTests st) {
    return kgenprogService.execFl(st);
  }
}
