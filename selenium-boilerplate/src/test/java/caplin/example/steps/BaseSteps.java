package caplin.example.steps;

import caplin.example.pages.BasePage;
import org.jbehave.core.annotations.Given;
import org.jbehave.core.annotations.Then;
import org.jbehave.core.annotations.When;

public class BaseSteps {

    private BasePage basePage;

    @Given("The browser has loaded")
    public void givenBrowserHasLoaded() {
        basePage.loadApp();
    }

    @When("I click the log in button on the home page")
    public void whenILogIn() {
        basePage.clickLoginButton();
    }

    @Then("I am logged in")
    public void thenIAmLoggedIn() {
        basePage.checkLoggedIn();
    }
}
