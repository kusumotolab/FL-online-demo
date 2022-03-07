package com.example;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class BuggyMyersTriangleTest {

  @Test
  public void testScalene1() {
    final int r = BuggyMyersTriangle.classify(1, 2, 3);
    assertEquals(3, r);
  }

  @Test
  public void testScalene2() {
    final int r = BuggyMyersTriangle.classify(1, 3, 2);
    assertEquals(3, r);
  }

  @Test
  public void testScalene3() {
    final int r = BuggyMyersTriangle.classify(2, 1, 3);
    assertEquals(3, r);
  }

  @Test
  public void testScalene4() {
    final int r = BuggyMyersTriangle.classify(2, 3, 1);
    assertEquals(3, r);
  }

  @Test
  public void testScalene5() {
    final int r = BuggyMyersTriangle.classify(3, 1, 2);
    assertEquals(3, r);
  }

  @Test
  public void testScalene6() {
    final int r = BuggyMyersTriangle.classify(3, 2, 1);
    assertEquals(3, r);
  }

  @Test
  public void testEquiliteral() {
    final int r = BuggyMyersTriangle.classify(1, 1, 1);
    assertEquals(1, r);
  }

  @Test
  public void testIsoceles1() {
    final int r = BuggyMyersTriangle.classify(2, 2, 3);
    assertEquals(2, r);
  }

  @Test
  public void testIsoceles2() {
    final int r = BuggyMyersTriangle.classify(2, 3, 2);
    assertEquals(2, r);
  }

  @Test
  public void testIsoceles3() {
    final int r = BuggyMyersTriangle.classify(3, 2, 2);
    assertEquals(2, r);
  }

  @Test
  public void testIsoceles4() {
    final int r = BuggyMyersTriangle.classify(2, 2, 1);
    assertEquals(2, r);
  }

  @Test
  public void testIsoceles5() {
    final int r = BuggyMyersTriangle.classify(2, 1, 2);
    assertEquals(2, r);
  }

  @Test
  public void testIsoceles6() {
    final int r = BuggyMyersTriangle.classify(1, 2, 2);
    assertEquals(2, r);
  }

  @Test
  public void testInvalid1() {
    final int r = BuggyMyersTriangle.classify(1, 2, 4);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid2() {
    final int r = BuggyMyersTriangle.classify(1, 4, 2);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid3() {
    final int r = BuggyMyersTriangle.classify(2, 1, 4);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid4() {
    final int r = BuggyMyersTriangle.classify(2, 4, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid5() {
    final int r = BuggyMyersTriangle.classify(4, 1, 2);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid6() {
    final int r = BuggyMyersTriangle.classify(4, 2, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid7() {
    final int r = BuggyMyersTriangle.classify(3, 1, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid8() {
    final int r = BuggyMyersTriangle.classify(1, 3, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalid9() {
    final int r = BuggyMyersTriangle.classify(1, 1, 3);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg1() {
    final int r = BuggyMyersTriangle.classify(-1, 1, 2);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg2() {
    final int r = BuggyMyersTriangle.classify(1, -1, 2);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg3() {
    final int r = BuggyMyersTriangle.classify(1, 2, -1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg4() {
    final int r = BuggyMyersTriangle.classify(-1, 2, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg5() {
    final int r = BuggyMyersTriangle.classify(2, -1, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg6() {
    final int r = BuggyMyersTriangle.classify(2, 1, -1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg7() {
    final int r = BuggyMyersTriangle.classify(-1, 1, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg8() {
    final int r = BuggyMyersTriangle.classify(1, -1, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg9() {
    final int r = BuggyMyersTriangle.classify(1, 1, -1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg10() {
    final int r = BuggyMyersTriangle.classify(-1, -1, 1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg11() {
    final int r = BuggyMyersTriangle.classify(1, -1, -1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg12() {
    final int r = BuggyMyersTriangle.classify(-1, 1, -1);
    assertEquals(-1, r);
  }

  @Test
  public void testInvalidNeg13() {
    final int r = BuggyMyersTriangle.classify(-1, -1, -1);
    assertEquals(-1, r);
  }
}
