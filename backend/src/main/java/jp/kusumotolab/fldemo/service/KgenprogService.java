package jp.kusumotolab.fldemo.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import jp.kusumotolab.fldemo.common.FlKind;
import jp.kusumotolab.fldemo.common.FlResult;
import jp.kusumotolab.fldemo.common.Project;
import jp.kusumotolab.fldemo.model.SrcAndTests;
import jp.kusumotolab.kgenprog.Configuration;
import jp.kusumotolab.kgenprog.Configuration.Builder;
import jp.kusumotolab.kgenprog.Strategies;
import jp.kusumotolab.kgenprog.ga.codegeneration.DefaultSourceCodeGeneration;
import jp.kusumotolab.kgenprog.ga.selection.DefaultVariantSelection;
import jp.kusumotolab.kgenprog.ga.validation.DefaultCodeValidation;
import jp.kusumotolab.kgenprog.ga.variant.Variant;
import jp.kusumotolab.kgenprog.ga.variant.VariantStore;
import jp.kusumotolab.kgenprog.project.jdt.JDTASTConstruction;
import jp.kusumotolab.kgenprog.project.test.LocalTestExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class KgenprogService {

  private Project project;

  public Map<String, FlResult> execFl(final SrcAndTests st) {
    project = Project.build(st);

    Variant initialVariant = createInitialVariant();

    if (!initialVariant.isBuildSucceeded()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    final Map<String, FlResult> ret = new HashMap<>();
    for (final var e : FlKind.values()) {
      ret.put(e.name(),
          new FlResult(
              e.execFl(initialVariant.getGeneratedSourceCode(), initialVariant.getTestResults())));
    }
    return ret;
  }

  private Variant createInitialVariant() {
    final Configuration config = new Builder(project.projectDir(), project.srcPath(),
        project.testPath()).build();
    final Strategies strategies = new Strategies(config.getFaultLocalization()
        .initialize(), new JDTASTConstruction(), new DefaultSourceCodeGeneration(),
        new DefaultCodeValidation(), new LocalTestExecutor(config),
        new DefaultVariantSelection(config.getHeadcount(), new Random(config.getRandomSeed())));
    final VariantStore vs = new VariantStore(config, strategies);
    return vs.getInitialVariant();
  }
}
