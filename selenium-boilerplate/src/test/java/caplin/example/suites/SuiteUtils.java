package caplin.example.suites;


import com.google.common.collect.Lists;
import org.jbehave.core.io.StoryFinder;

import java.io.IOException;
import java.net.URL;
import java.util.Collections;
import java.util.List;

import static java.lang.ClassLoader.getSystemClassLoader;
import static org.junit.Assert.fail;

public class SuiteUtils {

    public static List<String> getAllStoryPaths(String baseDir) {
        String story = System.getProperty("story", "*");

        List<String> storyPaths = Lists.newArrayList();

        for (URL resourceURL : SuiteUtils.getResourceURLs()) {
            storyPaths.addAll(new StoryFinder().findPaths(
                    resourceURL,baseDir + "/**/" + story + ".story", "**/x-*.story"));
        }

        System.out.println("\nAll Stories - found '" + storyPaths.size() + "' stories in base directory '" + baseDir + "': " +
                "\n<" + storyPaths + ">\n");

        return storyPaths;
    }

    private static List<URL> getResourceURLs() {
        try {
            return Collections.list(getSystemClassLoader().getResources("."));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return Collections.emptyList();
    }
}