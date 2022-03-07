package jp.kusumotolab.fldemo.service;

import com.google.googlejavaformat.java.Formatter;
import com.google.googlejavaformat.java.FormatterException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public class GoogleJavaFormatService {
  public static String format(final String src) {
    try {
      return new Formatter().formatSource(src);
    } catch (final FormatterException e) {
      log.warn("format parse failed" + src);
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "failed parsing source");
    }
  }
}
