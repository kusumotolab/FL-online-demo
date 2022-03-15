package jp.kusumotolab.fldemo.data;

import jp.kusumotolab.fldemo.common.FlKind;

public record Suspiciousness(int lineNumber, double rawSuspiciousness, double normalizedSuspiciousness) {

  public Suspiciousness(final jp.kusumotolab.kgenprog.fl.Suspiciousness ss, final FlKind fl){
    this(ss.getLocation().inferLineNumbers().start,ss.getValue(), fl.normalize(ss.getValue()));
  }
}
