package jp.kusumotolab.fldemo.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jp.kusumotolab.fldemo.service.GoogleJavaFormatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/format")
@Tag(name = "format", description = "format source code")
public class FormatController {

  @PostMapping
  public String format(@RequestBody String src) {
    return GoogleJavaFormatService.format(src);
  }
}
