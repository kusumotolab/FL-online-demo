package jp.kusumotolab.fldemo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import jp.kusumotolab.fldemo.common.FlKind;
import jp.kusumotolab.fldemo.data.FlResult;
import jp.kusumotolab.fldemo.data.SrcAndTests;
import jp.kusumotolab.fldemo.service.KgenprogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/fl")
@Scope("request")
@Tag(name = "FaultLocalization")
public class FlController {

  @Autowired private KgenprogService kgenprogService;

  @Operation(summary = "Exec FaultLocalization")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Succeeded"),
        @ApiResponse(responseCode = "400", description = "Validation Error")
      })
  @PostMapping("all")
  public Map<String, FlResult> flAll(@Validated @RequestBody SrcAndTests st) {
    return kgenprogService.execFl(st);
  }

  @Operation(
      summary = "List FaultLocalization Technics",
      description = "List of all available faultLocalization technics")
  @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Succeeded")})
  @GetMapping("technics")
  public List<FlKind> technics() {
    return Arrays.asList(FlKind.values());
  }
}
