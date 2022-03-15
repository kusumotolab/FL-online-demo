package jp.kusumotolab.fldemo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import jp.kusumotolab.fldemo.data.SrcAndTests;
import jp.kusumotolab.fldemo.data.TestResultWithCoverage;
import jp.kusumotolab.fldemo.service.KgenprogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/test")
@Scope("request")
@Tag(name = "Test")
public class TestController {

  @Autowired private KgenprogService kgenprogService;

  @Operation(summary = "Exec Test")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "OK",
            content =
                @Content(
                    mediaType = "application/json",
                    array =
                        @ArraySchema(
                            schema = @Schema(implementation = TestResultWithCoverage.class)))),
        @ApiResponse(
            responseCode = "400",
            description = "Validation Error",
            content = @Content(mediaType = "application/json", schema = @Schema(hidden = true)))
      })
  @PostMapping
  public List<TestResultWithCoverage> execTests(@Validated @RequestBody SrcAndTests st) {
    return kgenprogService.execTests(st);
  }
}
