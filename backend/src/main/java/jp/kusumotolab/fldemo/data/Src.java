package jp.kusumotolab.fldemo.data;

import jp.kusumotolab.fldemo.common.SourceUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class Src {

  private final String src;
  private final String fqn;
  private final String className;
  private final String packageName;

  public Src(final String src) {
    this(
        src,
        SourceUtil.inferFQN(src),
        SourceUtil.inferClassName(src),
        SourceUtil.inferPackageName(src));
  }
}
