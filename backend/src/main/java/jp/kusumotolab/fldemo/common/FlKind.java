package jp.kusumotolab.fldemo.common;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import jp.kusumotolab.kgenprog.fl.Ample;
import jp.kusumotolab.kgenprog.fl.DStar;
import jp.kusumotolab.kgenprog.fl.FaultLocalization;
import jp.kusumotolab.kgenprog.fl.Jaccard;
import jp.kusumotolab.kgenprog.fl.Ochiai;
import jp.kusumotolab.kgenprog.fl.Suspiciousness;
import jp.kusumotolab.kgenprog.fl.Tarantula;
import jp.kusumotolab.kgenprog.fl.Zoltar;
import jp.kusumotolab.kgenprog.ga.variant.Variant;
import jp.kusumotolab.kgenprog.project.GeneratedSourceCode;
import jp.kusumotolab.kgenprog.project.test.TestResults;

@Schema(enumAsRef = true)
public enum FlKind {
  Ample() {
    @Override
    public FaultLocalization getFl() {
      return new Ample();
    }

    @Override
    public double normalize(final double susp) {
      return susp;
    }
  },
  DStar() {
    @Override
    public FaultLocalization getFl() {
      return new DStar();
    }

    @Override
    public double normalize(double susp) {
      return Math.tanh(susp);
    }
  },
  Jaccard() {
    @Override
    public FaultLocalization getFl() {
      return new Jaccard();
    }

    @Override
    public double normalize(double susp) {
      return susp;
    }
  },
  Ochiai() {
    @Override
    public FaultLocalization getFl() {
      return new Ochiai();
    }

    @Override
    public double normalize(double susp) {
      return susp;
    }
  },
  Tarantula() {
    @Override
    public FaultLocalization getFl() {
      return new Tarantula();
    }

    @Override
    public double normalize(double susp) {
      return susp;
    }
  },
  Zolter() {
    @Override
    public FaultLocalization getFl() {
      return new Zoltar();
    }

    @Override
    public double normalize(double susp) {
      return susp;
    }
  };

  public abstract FaultLocalization getFl();

  public List<Suspiciousness> execFl(final Variant variant) {
    return execFl(variant.getGeneratedSourceCode(), variant.getTestResults());
  }

  public List<Suspiciousness> execFl(final GeneratedSourceCode src, final TestResults results) {
    return getFl().exec(src, results);
  }

  public abstract double normalize(final double susp);
}
