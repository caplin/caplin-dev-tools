package caplin.example.steps;

import caplin.example.pages.LoginPage;
import org.jbehave.core.annotations.When;

public class LoginSteps {

    private LoginPage loginPage;

    @When("I fill out the form and click log in")
    public void logIn(){
        loginPage.logIn("caplintester", "caplinpassword");
    }
}
