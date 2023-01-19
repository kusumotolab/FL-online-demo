package jp.kusumotolab.fldemo.data.project;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import jp.kusumotolab.fldemo.data.SrcDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class Project {

  private final Src src;
  private final Test test;
  private final Path projectDir;
  private final Path srcPath;
  private final Path testPath;

  public Project(final SrcDTO dto) {
    src = new Src(dto.src());
    test = new Test(dto.test());

    try {
      projectDir = Files.createTempDirectory("fldemo_");
      srcPath = src.createSrcFile(projectDir);
      testPath = test.createSrcFile(projectDir);
    } catch (final IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public Src getSrc() {
    return src;
  }

  public Test getTest() {
    return test;
  }

  public Path getProjectDir() {
    return projectDir;
  }

  public Path getSrcPath() {
    return srcPath;
  }

  public Path getTestPath() {
    return testPath;
  }
}
