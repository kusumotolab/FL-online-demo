package jp.kusumotolab.fldemo.common;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import jp.kusumotolab.fldemo.data.SrcAndTests;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
public record Project(String src, String srcFQN, String srcClassName, String srcPackageName,
                      String test, String testFQN, String testClassName, String testPackageName,
                      Path projectDir, Path srcPath, Path testPath) {

  @Builder public Project {} //workaround for intellij's issue on record and lombok.Builder

  public static Project build(final SrcAndTests st) {
    final ProjectBuilder projectBuilder = new ProjectBuilder().src(st.src());

    final String srcFQN = SourceUtil.inferFQN(st.src());
    projectBuilder.srcFQN(srcFQN)
        .srcClassName(SourceUtil.inferClassName(st.src()));

    final String srcPackageName = SourceUtil.inferPackageName(st.src());
    projectBuilder.srcPackageName(srcPackageName);

    final String testFQN = SourceUtil.inferFQN(st.test());
    projectBuilder.test(st.test())
        .testFQN(testFQN)
        .testClassName(SourceUtil.inferClassName(st.test()))
        .testPackageName(SourceUtil.inferPackageName(st.test()));

    try {
      final Path projectDir = Files.createTempDirectory("fldemo_");
      projectBuilder.projectDir(projectDir);

      final Path srcDir = projectDir.resolve(srcPackageName);
      Files.createDirectories(srcDir);

      final Path srcPath = projectDir.resolve(srcFQN);
      Files.writeString(srcPath, st.src());
      projectBuilder.srcPath(srcPath);

      final Path testPath = projectDir.resolve(testFQN);
      Files.writeString(testPath, st.test());
      projectBuilder.testPath(testPath);
    } catch (IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return projectBuilder.build();
  }
}
