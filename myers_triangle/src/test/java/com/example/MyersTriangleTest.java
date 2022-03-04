package com.example;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class MyersTriangleTest {

  @Test
  public void test1() {
    final int r = MyersTriangle.classify(1, 2, 3);
    assertEquals(3, r);
  }

  @Test
  public void testInvalid1() {
    final int r = MyersTriangle.classify(1, 2, 4);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid2() {
    final int r = MyersTriangle.classify(1, 4, 2);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid3() {
    final int r = MyersTriangle.classify(4, 1, 2);
    assertEquals(-1, r);

  }

  @Test
  public void testInvalidNeg1() {
    final int r = MyersTriangle.classify(-1, 1, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg2() {
    final int r = MyersTriangle.classify(1, -1, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg3() {
    final int r = MyersTriangle.classify(1, 1, -1);
    assertEquals(-1, r);
  }

  @Test
  public void testEquiliteral() {
    final int r = MyersTriangle.classify(1, 1, 1);
    assertEquals(1, r);
  }

  @Test
  public void testIsoceles1() {
    final int r = MyersTriangle.classify(2, 2, 3);
    assertEquals(2, r);
  }

  @Test
  public void testIsoceles2() {
    final int r = MyersTriangle.classify(2, 3, 2);
    assertEquals(2, r);
  }

  @Test
  public void testIsoceles3() {
    final int r = MyersTriangle.classify(3, 2, 2);
    assertEquals(2, r);
  }

  @Test
  public void testInvalid() {
    final int r = MyersTriangle.classify(3, 1, 1);
    assertEquals(-1, r);
  }
}
