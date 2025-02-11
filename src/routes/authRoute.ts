import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const router = Router();
const FE_URL = process.env.FE_URL!;

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }),()=>{
  console.log("Google Route accessed");
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: FE_URL }),
  (req: Request, res: Response) => {
    console.log("Google callback");
    // res.redirect('https://zn12df18-5173.inc1.devtunnels.ms/')
    res.redirect(FE_URL);
  }
);

router.get('/user', (req: Request, res: Response) => {
  console.log("User Route accessed");
  console.log("Session: ", req.session);
  if (req.user) {
    res.json({
      success: true,
      user: req.user,
    });
    console.log("User:---", req.user);
  } 
  else {
    res.status(401).json({ success: false, error: 'User not authenticated' });
  }
});
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('Session');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
});

export default router;
