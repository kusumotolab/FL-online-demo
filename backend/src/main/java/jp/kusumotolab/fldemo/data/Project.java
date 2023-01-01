package jp.kusumotolab.fldemo.data;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
public record Project(Src src, Test test, Path projectDir, Path srcPath, Path testPath) {

  @Builder
  public Project {} // workaround for intellij's issue on record and lombok.Builder

  public static Project build(final SrcDTO dto) {
    final var src = new Src(dto.src());
    final var test = new Test(dto.test());

    final ProjectBuilder projectBuilder = new ProjectBuilder().src(src).test(test);

    try {
      final Path projectDir = Files.createTempDirectory("fldemo_");
      projectBuilder.projectDir(projectDir);

      final Path srcPath = projectDir.resolve(src.getFqn());
      Files.createDirectories(srcPath.getParent());
      Files.writeString(srcPath, src.getSrc());
      projectBuilder.srcPath(srcPath);

      final Path testPath = projectDir.resolve(test.getFqn());
      Files.createDirectories(testPath.getParent());
      Files.writeString(testPath, test.getSrc());
      projectBuilder.testPath(testPath);

    } catch (final IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return projectBuilder.build();
  }
}
