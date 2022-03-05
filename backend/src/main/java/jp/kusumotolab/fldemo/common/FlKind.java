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
  Ample(new Ample()) {
    @Override
    public double normalize(final double susp) {
      return susp;
    }
  },
  DStar(new DStar()) {
    @Override
    public double normalize(double susp) {
      return Math.tanh(susp);
    }
  },
  Jaccard(new Jaccard()) {
    @Override
    public double normalize(double susp) {
      return susp;
    }
  },
  Ochiai(new Ochiai()) {
    @Override
    public double normalize(double susp) {
      return susp;
    }
  },
  Tarantula(new Tarantula()) {
    @Override
    public double normalize(double susp) {
      return susp;
    }
  },
  Zolter(new Zoltar()) {
    @Override
    public double normalize(double susp) {
      return susp;
    }
  };

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

  public abstract double normalize(final double susp);
}
