package jp.kusumotolab.fldemo.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Paths;
import jp.kusumotolab.fldemo.data.SrcAndTests;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class TestControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void testEmpty() throws Exception {
    final String src = "";
    final String test = "";

    var st = new SrcAndTests(src, test);

    mockMvc.perform(post("/api/test").content(objectMapper.writeValueAsString(st))
        .contentType(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isBadRequest());
  }

  @Test
  void testBuildFailure01() throws Exception {
    final String src = Files.readString(
        Paths.get("example/BuildFailure01/src/example/NonCompilable.java"));
    final String test = Files.readString(
        Paths.get("example/BuildSuccess01/src/example/FooTest.java")); //Compilable test

    var st = new SrcAndTests(src, test);

    mockMvc.perform(post("/api/test").content(objectMapper.writeValueAsString(st))
        .contentType(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isBadRequest());
  }

  @Test
  void testBuildSuccess01() throws Exception {
    final String src = Files.readString(Paths.get("example/BuildSuccess01/src/example/Foo.java"));
    final String test = Files.readString(
        Paths.get("example/BuildSuccess01/src/example/FooTest.java"));

    var st = new SrcAndTests(src, test);

    mockMvc.perform(post("/api/test").content(objectMapper.writeValueAsString(st))
        .contentType(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isOk());
  }

  @Test
  void testCloseToZero01() throws Exception {
    final String src = Files.readString(
        Paths.get("example/CloseToZero01/src/example/CloseToZero.java"));
    final String test = Files.readString(
        Paths.get("example/CloseToZero01/src/example/CloseToZeroTest.java"));

    var st = new SrcAndTests(src, test);

    mockMvc.perform(post("/api/test").content(objectMapper.writeValueAsString(st))
        .contentType(MediaType.APPLICATION_JSON)).andDo(print()).andExpect(status().isOk());
  }

}
