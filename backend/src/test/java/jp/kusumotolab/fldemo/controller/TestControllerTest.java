package jp.kusumotolab.fldemo.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import jp.kusumotolab.fldemo.TestUtil;
import jp.kusumotolab.fldemo.data.SrcDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class TestControllerTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  private ResultActions post(final SrcDTO srcDTO) throws Exception {
    return mockMvc
        .perform(
            MockMvcRequestBuilders.post("/api/test")
                .content(objectMapper.writeValueAsString(srcDTO))
                .contentType(MediaType.APPLICATION_JSON))
        .andDo(print());
  }

  @Test
  void testEmpty() throws Exception {
    var dto = new SrcDTO("", "");

    post(dto).andExpect(status().isBadRequest());
  }

  @Test
  void testBuildFailure01() throws Exception {
    final SrcDTO dto =
        TestUtil.buildFromFiles(
            "example/BuildFailure01/src/example/NonCompilable.java",
            "example/BuildSuccess01/src/example/FooTest.java" // Compilable test
            );

    post(dto).andExpect(status().isBadRequest());
  }

  @Test
  void testBuildSuccess01() throws Exception {
    final SrcDTO dto =
        TestUtil.buildFromFiles(
            "example/BuildSuccess01/src/example/Foo.java",
            "example/BuildSuccess01/src/example/FooTest.java");

    post(dto).andExpect(status().isOk());
  }

  @Test
  void testCloseToZero01() throws Exception {
    final SrcDTO dto =
        TestUtil.buildFromFiles(
            "example/CloseToZero01/src/com/example/CloseToZero.java",
            "example/CloseToZero01/src/com/example/CloseToZeroTest.java");

    post(dto).andExpect(status().isOk());
  }

  @Test
  void testNotContainsPackageName01() throws Exception {
    final SrcDTO dto =
        TestUtil.buildFromFiles(
            "example/NotContainsPackageName01/Foo.java",
            "example/NotContainsPackageName01/FooTest.java");

    post(dto).andExpect(status().isBadRequest());
  }

  @Test
  void testNotContainsTest01() throws Exception {
    final SrcDTO dto =
        TestUtil.buildFromFiles(
            "example/NotContainsTest01/src/example/Foo.java",
            "example/NotContainsTest01/src/example/FooTest.java");

    post(dto).andExpect(status().isBadRequest());
  }
}
