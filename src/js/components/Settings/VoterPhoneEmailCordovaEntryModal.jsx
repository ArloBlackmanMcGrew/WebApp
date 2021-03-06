import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import MessageIcon from '@material-ui/icons/Message';
import clsx from 'clsx';
import { withStyles, withTheme } from '@material-ui/core/styles';
import SplitIconButton from '../Widgets/SplitIconButton';
import VoterEmailAddressEntry from './VoterEmailAddressEntry';
import VoterPhoneVerificationEntry from './VoterPhoneVerificationEntry';
import { isCordova, restoreStylesAfterCordovaKeyboard, isIPhone3p5in, isIPhone4in, isIPhone4p7in } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';


// Work around for dialog placement in Cordova when virtual keyboard appears
class VoterPhoneEmailCordovaEntryModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    closeSignInModal: PropTypes.func,
    // inModal: PropTypes.bool,
    // toggleOtherSignInOptions: PropTypes.func,
    isPhone: PropTypes.bool,
    hideDialogForCordova: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      showDialog: false,
    };
    this.closeSignInModalLocal = this.closeSignInModalLocal.bind(this);
  }

  setDialogVisible () {
    console.log('VoterPhoneEmailCordovaEntryModal setDialogVisible');
    this.setState({
      showDialog: true,
    });
    this.props.hideDialogForCordova();
  }

  closeSignInModalLocal () {
    console.log('VoterPhoneEmailCordovaEntryModal closeSignInModalLocal showDialog false ======================================');
    // Because there are multiple listeners on the voterStore, some dispatching will occur for the underlying ballot page,
    // which totally messes us up here, and leaves this modal on the screen after it should've been dismissed, especially on the iPhone 5.
    // So as a workaround we close this modal when we detect that they have signed in successfully with the email,
    // which requires this further hack, Which is sensitive to checking whether the modal actually still exists.
    restoreStylesAfterCordovaKeyboard('VoterPhoneEmailCordovaEntryModal');

    try {
      console.log('VoterPhoneEmailCordovaEntryModal closeSignInModalLocal this.props valid');
      this.props.closeSignInModal();
    } catch (err) {
      console.log('VoterPhoneVerificationEntryModal closeSignInModalLocal caught error: ', err);
    }
  }

  render () {
    renderLog('VoterPhoneVerificationEntryModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { showDialog } = this.state;
    const { classes, isPhone } = this.props;
    const isSmallApple = isIPhone3p5in() || isIPhone4in() || isIPhone4p7in();

    return (
      <React.Fragment>
        <div className="u-stack--md">
          <SplitIconButton
            backgroundColor="#76d00b"
            buttonText={isPhone ? 'Sign in with a text' : 'Sign in with an Email'}
            externalUniqueId={isPhone ? 'smsSignIn' : 'emailSignIn'}
            icon={isPhone ? <MessageIcon /> : <MailOutlineIcon />}
            onClick={() => this.setDialogVisible()}
            separatorColor="rgba(250, 250, 250, .6)"
            title={isPhone ? 'Sign in by SMS' : 'Sign in by email'}
          />
        </div>
        <Dialog
          open={showDialog}
          id="textOrEmailEntryDialog"
          classes={{
            paper: clsx(classes.dialogPaper, {
              [classes.phoneInputCordovaSmallApples]: isSmallApple && isPhone,
              [classes.emailInputCordovaSmallApples]: isSmallApple && !isPhone,
              [classes.phoneInputCordovaLargerApples]: !isSmallApple && isPhone,
              [classes.emailInputCordovaLargerApples]: !isSmallApple && !isPhone,
            }),
            root: classes.dialogRoot,
          }}
        >
          <DialogContent id="textOrEmailEntryContent" style={{ paddingTop: `${isCordova() ? 'unset' : 'undefined'}`, bottom: `${isCordova() ? 'unset' : 'undefined'}` }}>
            {isPhone ? (
              <VoterPhoneVerificationEntry
                closeSignInModal={this.closeSignInModalLocal}
                inModal
                // toggleOtherSignInOptions={this.props.toggleNonPhoneSignInOptions}
              />
            ) : (
              <VoterEmailAddressEntry
                closeSignInModal={this.closeSignInModalLocal}
                inModal
                // toggleOtherSignInOptions={this.props.toggleNonEmailSignInOptions}
              />
            )}
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  dialogPaper: {
    marginTop: 48,
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  phoneInputCordovaSmallApples: {
    margin: '32px 32px 0 32px',
    height: 'unset',
    minHeight: 'unset',
  },
  emailInputCordovaSmallApples: {
    margin: '32px 32px 0 32px',
    height: 'unset',
    minHeight: 'unset',
    top: '-25%',
  },
  phoneInputCordovaLargerApples: {
    height: 'unset',
    minHeight: 'unset',
    top: '-5%',
  },
  emailInputCordovaLargerApples: {
    height: 'unset',
    minHeight: 'unset',
    top: '-5%',
  },
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
});

export default withTheme(withStyles(styles)(VoterPhoneEmailCordovaEntryModal));
