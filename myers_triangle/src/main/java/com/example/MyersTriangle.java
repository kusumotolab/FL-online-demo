package com.example;

public class MyersTriangle {

  public static int classify(final int a, final int b, final int c) {
    if (a == b && b == c && c == a) {
      if (a <= 0) return -1;
      return 1;
    }
    if (a < b && b == c) {
      if (a <= 0) return -1;
      return 2;
    }
    if (b == c && c < a) {
      if (b + c < a) return -1;
      return 2;
    }
    if (b < c && c == a) {
      if (b <= 0) return -1;
      return 2;
    }
    if (c == a && a < b) {
      if (c + a < b) return -1;
      return 2;
    }
    if (c < a && a == b) {
      if (c <= 0) return -1;
      return 2;
    }
    if (a == b && b < c) {
      if (a + b < c) return -1;
      return 2;
    }
    if (a < b && b < c) {
      if (a + b < c) return -1;
      return 3;
    }
    if (a < c && c < b) {
      if (a + c < b) return -1;
      return 3;
    }
    if (b < a && a < c) {
      if (b + a < c) return -1;
      return 3;
    }
    if (b < c && c < a) {
      if (b + c < a) return -1;
      return 3;
    }
    if (c < a && a < b) {
      if (c + a < b) return -1;
      return 3;
    }
    if (c < b && b < a) {
      if (c + b < a) return -1;
      return 3;
    }

    return 0;
  }
}
