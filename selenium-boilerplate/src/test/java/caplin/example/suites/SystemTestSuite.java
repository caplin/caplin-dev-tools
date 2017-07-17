package caplin.example.suites;

import net.serenitybdd.jbehave.SerenityStories;

import java.util.List;

import static caplin.example.suites.SuiteUtils.getAllStoryPaths;

public class SystemTestSuite extends SerenityStories {

    final String BASE_DIR = "stories";

    @Override
    public List<String> storyPaths() {
        return getAllStoryPaths(BASE_DIR);
    }
}
