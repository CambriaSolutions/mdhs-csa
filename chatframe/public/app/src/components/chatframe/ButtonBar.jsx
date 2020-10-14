import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { findLast, find, filter, reduce, findIndex } from 'lodash'
import grey from '@material-ui/core/colors/grey'
import { sendQuickReply } from './actions/conversation'

const Container = styled.div`
  grid-area: buttonbar;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  padding: ${p => (p.visible ? '4px 8px 12px 16px' : '0 16px')};
  background: ${grey[300]};
  border-top: ${p => (p.visible ? '1px solid rgba(0, 0, 0, 0.2)' : 'none')};
  overflow-y: auto;
`

const Btn = styled(Button)`
  && {
    margin-right: 8px;
    margin-top: 8px;
    padding-left: 5px;
    padding-right: 5px;
    display: ${p => (p.visible === 'true' ? 'block' : 'none')};
    background-color: ${p => (p.navigationbutton === 'true' ? 'rgb(36,39,44)' : 'rgb(240,240,240)')};
    color: ${p => (p.navigationbutton === 'true' ? ' white' : 'secondary')};
    border-radius: 10px;
    font-size: 14px;
    width: 100%
    
  }

  :hover {
    background-color: rgb(181,181,181) !important;
  }
`

const findLastMessageWithSuggestions = (messages) => findLast(messages, m => {
  const hasSuggestions = find(m.responses, ['type', 'suggestion'])
  return hasSuggestions
})

const getSuggestions = (messageWithSuggestions) => messageWithSuggestions.responses.filter(m => m.type === 'suggestion')[0].suggestions

class ButtonBar extends PureComponent {
  minColumnSpan = suggestion => {
    if (suggestion.length >= 18) {
      return 3
    } else if (suggestion.length >= 13 && suggestion.length < 18) {
      return 2
    }
    return 1
  }

  arrangeSubjectMatterSuggestions = suggestionElements => ([
    [find(suggestionElements, x => x.label.toLowerCase() === 'child support')],
    [find(suggestionElements, x => x.label.toLowerCase() === 'snap'), find(suggestionElements, x => x.label.toLowerCase() === 'tanf')],
    [find(suggestionElements, x => x.label.toLowerCase() === 'workforce development')]
  ])

  playTetris = buttons => {
    const findNextInCollection = (reqColumnSpan, currentCollection) => {
      // Find the next button to display in button bar
      const next = find(currentCollection, x => x.minColumnSpan === reqColumnSpan)

      // Exclude the button found from the collection of buttons left to render
      const remainingButtons = filter(currentCollection, x => !next || x.label !== next.label)

      return ({
        next,
        remainingButtons
      })
    }

    const buttonRowsResult = reduce(buttons, (results, currentButton) => {
      // If the current button has not been added, start a new row
      if (findIndex(results.remainingButtons, x => x.label === currentButton.label) >= 0) {
        const btn1 = currentButton
        let _remainingButtons = filter(results.remainingButtons, x => x.label !== btn1.label)

        // If btn1 is large, then it's the only button in row.
        // Add the button to the row, and remove the button from list
        // of buttons left to add
        if (btn1.minColumnSpan === 3) {
          return ({
            buttonRows: [
              ...results.buttonRows,
              [btn1]
            ],
            remainingButtons: _remainingButtons
          })
        }

        // If btn1 is medium, then it needs a second button,
        // preferably medium, but can be small. If none exist that
        // match this criteria, then add button by itself. It will span full width
        // Add the buttons to the row, and remove the buttons from list
        // of buttons left to add
        if (btn1.minColumnSpan === 2) {
          let nextInCollectionResult = findNextInCollection(2, _remainingButtons)
          _remainingButtons = nextInCollectionResult.remainingButtons

          // If no medium button is found, search for small
          if (!nextInCollectionResult.next) {
            nextInCollectionResult = findNextInCollection(1, _remainingButtons)
            _remainingButtons = nextInCollectionResult.remainingButtons
          }

          const btn2 = nextInCollectionResult.next

          // Filter out second button if compatible one not found
          const buttonRow = filter([btn1, btn2], x => !!x)

          return ({
            buttonRows: [
              ...results.buttonRows,
              buttonRow
            ],
            remainingButtons: _remainingButtons
          })
        }

        // If btn1 is small, then try to fit 3 small. If can't
        // find 1 or 2 more small, then try to add a medium. If none exist that
        // match this criteria, then add button by itself and span full width
        // Add the buttons to the row, and remove the buttons from list
        // of buttons left to add
        if (btn1.minColumnSpan === 1) {
          let nextInCollectionResult = findNextInCollection(1, _remainingButtons)
          let btn2 = nextInCollectionResult.next
          _remainingButtons = nextInCollectionResult.remainingButtons

          // If a small button is found, try to find a third
          if (btn2) {
            const nextInCollectionResult2 = findNextInCollection(1, _remainingButtons)
            const btn3 = nextInCollectionResult2.next
            _remainingButtons = nextInCollectionResult2.remainingButtons

            // Even if a third button is not found, return the current two as row

            // Filter out second and/or third button if compatible not found
            const buttonRow = filter([btn1, btn2, btn3], x => !!x)

            return ({
              buttonRows: [
                ...results.buttonRows,
                buttonRow
              ],
              remainingButtons: _remainingButtons
            })
          }

          // If no small button is found, search for medium
          if (!nextInCollectionResult.next) {
            nextInCollectionResult = findNextInCollection(2, _remainingButtons)
            btn2 = nextInCollectionResult.next
            _remainingButtons = nextInCollectionResult.remainingButtons
          }

          // Even if a second button is not found, return the current one as row

          // Filter out second button if compatible one not found
          const buttonRow = filter([btn1, btn2], x => !!x)

          return ({
            buttonRows: [
              ...results.buttonRows,
              buttonRow
            ],
            remainingButtons: _remainingButtons
          })
        }
      }
      return results
    }, { buttonRows: [], remainingButtons: buttons })

    const { buttonRows } = buttonRowsResult

    return buttonRows
  }

  render() {
    const { visible, messages, sendQuickReply, paginationPage, changeSuggestionPage } = this.props

    const lastMessageWithSuggestions = findLastMessageWithSuggestions(messages)

    const suggestionElements = []

    let backButtonLabel = null
    let isSelectingSubjectMatter = false

    if (lastMessageWithSuggestions) {
      const suggestions = getSuggestions(lastMessageWithSuggestions)

      // Start over and home button are the same, but based on server
      // code version, we might receive 'home' or 'start over' as suggestion
      const excludedBackAndStartOver = filter(suggestions, x => x.toLowerCase() !== 'go back' && x.toLowerCase() !== 'home' && x.toLowerCase() !== 'start over')

      if (excludedBackAndStartOver.length === 4
        && find(excludedBackAndStartOver, x => x.toLowerCase() === 'child support')
        && find(excludedBackAndStartOver, x => x.toLowerCase() === 'tanf')
        && find(excludedBackAndStartOver, x => x.toLowerCase() === 'snap')
        && find(excludedBackAndStartOver, x => x.toLowerCase() === 'workforce development')) {
        isSelectingSubjectMatter = true
      }

      // We search for it and use it because we want
      // to persist the casing that we get back from server
      backButtonLabel = find(suggestions, x => x.toLowerCase() === 'go back')

      for (const suggestion of excludedBackAndStartOver) {
        const minColumnSpan = this.minColumnSpan(suggestion)

        suggestionElements.push({
          label: suggestion,
          id: lastMessageWithSuggestions.messageId,
          visible,
          minColumnSpan
        })
      }
    }

    const buttonRows = isSelectingSubjectMatter
      ? this.arrangeSubjectMatterSuggestions(suggestionElements)
      : this.playTetris(suggestionElements)

    const numberOfRowsPerPage = isSelectingSubjectMatter ? 4 : 2

    const numberOfNavigationPages = Math.ceil(buttonRows.length / numberOfRowsPerPage)

    const paginationPages = new Array(numberOfNavigationPages)
      .fill()
      .map(() => buttonRows.splice(0, numberOfRowsPerPage))

    const activeSuggestionPage = paginationPages[paginationPage - 1]
      ? paginationPages[paginationPage - 1]
      : paginationPages[0]

    return (
      (suggestionElements.length > 0 || backButtonLabel) &&
      (
        <Container visible={visible}>
          {/* Start of suggestion rows */}
          <Grid container>
            {suggestionElements.length > 0 &&
              activeSuggestionPage.map((btns, i) => (
                <Grid
                  key={`buttonRow_${i}`}
                  container
                  item
                  spacing={8}
                  xs={12}
                >
                  {btns.map((btn, index) => (
                    <Grid
                      key={`buttonRow_${i}_${index}`}
                      item
                      xs={12 / btns.length}
                    >
                      <Btn
                        size="small"
                        color="secondary"
                        key={`${btn.id}-btn${index}`}
                        visible={btn.visible.toString()}
                        navigationbutton="false"
                        onClick={() => sendQuickReply(btn.label.toUpperCase())}
                      >
                        {btn.label.toUpperCase()}
                      </Btn>
                    </Grid>
                  ))}
                </Grid>
              ))}
            {/* Start of navigation row */}
            <Grid item container xs={12} justify="space-between" spacing={8}>
              {backButtonLabel && paginationPage === 1 && (
                <Grid item xs={4}>
                  <Btn
                    size="small"
                    color="secondary"
                    visible="true"
                    navigationbutton="true"
                    onClick={() => sendQuickReply(backButtonLabel.toUpperCase())}
                  >
                    {backButtonLabel.toUpperCase()}
                  </Btn>
                </Grid>
              )}
              {numberOfNavigationPages > 1 && paginationPage > 1 && (
                <Grid item xs={5}>
                  <Btn
                    size="small"
                    color="secondary"
                    visible="true"
                    navigationbutton="true"
                    onClick={() => changeSuggestionPage(paginationPage - 1)}
                  >
                    Previous Options
                  </Btn>
                </Grid>
              )}
              {numberOfNavigationPages > 1 && paginationPage < numberOfNavigationPages && (
                <Grid item xs={5}>
                  <Btn
                    size="small"
                    color="secondary"
                    visible="true"
                    navigationbutton="true"
                    onClick={() => changeSuggestionPage(paginationPage + 1)}
                  >
                    More Options
                  </Btn>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Container>
      )
    )
  }
}

const mapStateToProps = state => {
  return {
    visible: state.buttonBar.visible,
    messages: state.conversation.messages,
    paginationPage: state.buttonBar.paginationPage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendQuickReply: text => {
      dispatch(sendQuickReply(text))
    },
    changeSuggestionPage: newPage => dispatch({
      type: 'CHANGE_SUGGESTION_PAGE',
      paginationPage: newPage
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ButtonBar)
