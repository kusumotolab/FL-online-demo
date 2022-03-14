/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  readonly "/api/test": {
    readonly post: operations["execTests"];
  };
  readonly "/api/fl/all": {
    readonly post: operations["flAll"];
  };
  readonly "/api/health": {
    readonly get: operations["health"];
  };
  readonly "/api/fl/technics": {
    /** List of all available faultLocalization technics */
    readonly get: operations["technics"];
  };
}

export interface components {
  readonly schemas: {
    /** @description source and tests to exec */
    readonly SrcAndTests: {
      /**
       * @description source code to exec
       * @example package example;
       *
       * public class CloseToZero {
       *
       *   /* Increase or reduce the given value to be close to zero. *\/
       *   public static int run(int n) {
       *     if (n == 0) {
       *       n++; // a bug here. zero should be zero
       *     } else if (n > 0) {
       *       n--;
       *     } else {
       *       n++;
       *     }
       *     return n;
       *   }
       *
       * }
       */
      readonly src: string;
      /**
       * @description test code to exec
       * @example package example;
       *
       * import static org.junit.Assert.assertEquals;
       * import org.junit.Test;
       *
       * public class CloseToZeroTest {
       *   @Test
       *   public void test01() {
       *     assertEquals(4, CloseToZero.run(5));
       *   }
       *
       *   @Test
       *   public void test02() {
       *     assertEquals(0, CloseToZero.run(0));
       *   }
       *
       *   @Test
       *   public void test03() {
       *     assertEquals(-4, CloseToZero.run(-5));
       *   }
       *
       * }
       */
      readonly test: string;
    };
    /** @description Coverage */
    readonly Coverage: {
      /**
       * Format: int32
       * @description line number
       * @example 1
       */
      readonly lineNumber: number;
      /**
       * @description status of coverage. The value is EMPTY, COVERED, or NOT_COVERED.
       * @example COVERED
       */
      readonly status: string;
    };
    readonly TestResultWithCoverage: {
      readonly testMethod?: string;
      /** Format: int32 */
      readonly testOrder?: number;
      readonly coverages?: readonly components["schemas"]["Coverage"][];
      readonly executedTestFQN?: string;
      readonly failed?: boolean;
      readonly failedReason?: string;
    };
    readonly FlResult: {
      readonly technique?: string;
      readonly suspiciousnesses?: readonly components["schemas"]["Suspiciousness"][];
    };
    readonly Suspiciousness: {
      /** Format: int32 */
      readonly lineNumber?: number;
      /** Format: double */
      readonly rawSuspiciousness?: number;
      /** Format: double */
      readonly normalizedSuspiciousness?: number;
    };
    /** @enum {string} */
    readonly FlKind:
      | "Ample"
      | "DStar"
      | "Jaccard"
      | "Ochiai"
      | "Tarantula"
      | "Zolter";
  };
}

export interface operations {
  readonly execTests: {
    readonly responses: {
      /** OK */
      readonly 200: {
        readonly content: {
          readonly "application/json": readonly components["schemas"]["TestResultWithCoverage"][];
        };
      };
      /** Validation Error */
      readonly 400: {
        readonly content: {
          readonly "application/json": unknown;
        };
      };
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["SrcAndTests"];
      };
    };
  };
  readonly flAll: {
    readonly responses: {
      /** OK */
      readonly 200: {
        readonly content: {
          readonly "application/json": readonly components["schemas"]["FlResult"][];
        };
      };
      /** Validation Error */
      readonly 400: {
        readonly content: {
          readonly "application/json": unknown;
        };
      };
    };
    readonly requestBody: {
      readonly content: {
        readonly "application/json": components["schemas"]["SrcAndTests"];
      };
    };
  };
  readonly health: {
    readonly responses: {
      /** OK */
      readonly 200: unknown;
    };
  };
  /** List of all available faultLocalization technics */
  readonly technics: {
    readonly responses: {
      /** OK */
      readonly 200: {
        readonly content: {
          readonly "application/json": readonly components["schemas"]["FlKind"][];
        };
      };
    };
  };
}

export interface external {}
