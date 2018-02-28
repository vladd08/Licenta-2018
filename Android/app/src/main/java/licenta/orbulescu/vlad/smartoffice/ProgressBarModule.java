package licenta.orbulescu.vlad.smartoffice;

import android.app.Activity;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.widget.FrameLayout;

/**
 * Created by Vlad Orbulescu on 2/27/2018.
 */

public class ProgressBarModule {
    private Activity activity;
    android.widget.ProgressBar progressBar;
    private AlphaAnimation inAnimation;
    private AlphaAnimation outAnimation;

    public ProgressBarModule(Activity activity) {
        this.activity = activity;
        progressBar = (android.widget.ProgressBar) activity.findViewById(R.id.progressBar);
    }

    public void showBar(){
        inAnimation = new AlphaAnimation(0f, 1f);
        inAnimation.setDuration(200);
        progressBar.setVisibility(View.VISIBLE);
    }

    public void hideBar() {
        outAnimation = new AlphaAnimation(1f, 0f);
        outAnimation.setDuration(200);
        progressBar.setVisibility(View.GONE);
    }
}
