package jp.kusumotolab.fldemo.common;

import java.util.List;
import jp.kusumotolab.kgenprog.fl.Ample;
import jp.kusumotolab.kgenprog.fl.DStar;
import jp.kusumotolab.kgenprog.fl.FaultLocalization;
import jp.kusumotolab.kgenprog.fl.Jaccard;
import jp.kusumotolab.kgenprog.fl.Ochiai;
import jp.kusumotolab.kgenprog.fl.Suspiciousness;
import jp.kusumotolab.kgenprog.fl.Tarantula;
import jp.kusumotolab.kgenprog.fl.Zoltar;
import jp.kusumotolab.kgenprog.project.GeneratedSourceCode;
import jp.kusumotolab.kgenprog.project.test.TestResults;

public enum FlKind {
  Ample(new Ample()),
  DStar(new DStar()),
  Jaccard(new Jaccard()),
  Ochiai(new Ochiai()),
  Tarantula(new Tarantula()),
  Zolter(new Zoltar());

  private final FaultLocalization fl;

  FlKind(final FaultLocalization fl) {
    this.fl = fl;
  }

  public FaultLocalization getFl() {
    return fl;
  }

  public List<Suspiciousness> execFl(final GeneratedSourceCode src, final TestResults results) {
    return fl.exec(src, results);
  }
}
