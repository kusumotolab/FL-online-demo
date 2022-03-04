package com.example;


public class MyersTriangle {

  public static int classify(final int a, final int b, final int c) {
    int trian;
    if ((a <= 0) || (b <= 0) || (c <= 0)) {
      return -1;
    }
    trian = 0;
    if (a == b) {
      trian = trian + 1;
    }
    if (a == c) {
      trian = trian + 2;
    }
    if (b == c) {
      trian = trian + 3;
    }
    if (trian == 0) {
      if (((a + b) < c) || ((a + c) < b) || ((b + c) < a)) {
        return -1;
      } else {
        return 3;
      }
    }
    if (trian > 3) {
      return 1;
    }
    if ((trian == 1) && ((a + b) > c)) {
      return 2;
    } else if ((trian == 2) && ((a + c) > b)) {
      return 2;
    } else if ((trian == 3) && ((b + c) > a)) {
      return 2;
    }
    return -1;
  }

}
