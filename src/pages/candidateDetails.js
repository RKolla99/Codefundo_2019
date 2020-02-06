import React from 'react';
import { Button, Label, Table, Input } from 'reactstrap';

const constituencyStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  // margin: '40px',
  padding: '40px'
  // backgroundColor: 'white'
};

const constituencyInputStyle = {
  margin: 'auto',
  marginBottom: '20px',
  width: '300px',
  // backgroundColor: 'white',
  padding: '20px'
};

class CandidateDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      show_candidate_list: false,
      candidates_total: 0,
      candidate_details: [],
      expanded_rows: []
    };
    this.getCandidateList = this.getCandidateList.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  // used to populate candidate list
  getCandidateList() {
    let valid_constituencyID = true;
    if (valid_constituencyID) {
      this.setState({
        show_candidate_list: true,
        candidates_total: 3,
        candidate_details: [
          {
            id: 1,
            name: 'Bob',
            image:
              ' data:image/jpeg;base64,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',
            party: 'BJP',
            party_image: '',
            promises_made: [
              'Free Dogs, CatYlj1aoz0lEwqCEI4,',
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the le"
            ],
            promises_kept: ['Free Dogs']
          },
          {
            id: 2,
            name: 'john'
          },
          {
            id: 3,
            name: 'arya'
          }
        ]
      });
    } else {
      alert('Invalid Constituency ID');
    }
  }

  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expanded_rows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? currentExpandedRows.filter(id => id !== rowId)
      : currentExpandedRows.concat(rowId);

    this.setState({ expanded_rows: newExpandedRows });
  }

  renderRow(item) {
    const clickCallback = () => this.handleRowClick(item.id);
    const itemRows = [
      <tr onClick={clickCallback} key={'row-data-' + item.id}>
        <td align='center' style={{ width: '100px' }}>
          <img
            src={`data:image/jpg;base64,${item.party_image}`}
            width='20px'
            height='20px'
            alt=''
          />
        </td>
        <td align='center'>{item.name}</td>
      </tr>
    ];

    if (this.state.expanded_rows.includes(item.id)) {
      itemRows.push(
        <tr key={'row-expanded-' + item.id} style={{ height: 'auto' }}>
          <td style={{ width: '100px' }}>
            <div style={{ maxWidth: '100px' }}>
              <img src={item.image} width='80px' height='80px' alt='' /> <br />
              <span style={{ margin: 'auto' }}>
                <b> {item.party} </b>
              </span>
            </div>
          </td>
          <td>
            <div style={{ width: '100%' }}>
              <span>
                <b>Promises Kept:</b>
              </span>
              <br />
              <span>&nbsp;&nbsp;{item.promises_kept}</span>
              <br />
              <span>
                <b>Promises Made:</b>
              </span>{' '}
              <br />
              <div>&nbsp;&nbsp;{item.promises_made}</div>
            </div>
          </td>
        </tr>
      );
    }

    return itemRows;
  }

  render() {
    let candidate_rows = [];

    this.state.candidate_details.forEach(item => {
      const row = this.renderRow(item);
      candidate_rows = candidate_rows.concat(row);
    });

    return (
      <div>
        <div style={constituencyStyle}>
          <div style={constituencyInputStyle}>
            <Label for='const_id'> Constituency ID </Label>
            <Input id='const_id' />
            <br />
            <Button value='Submit' onClick={this.getCandidateList}>
              {' '}
              Submit{' '}
            </Button>
          </div>
          <br />
          {this.state.show_candidate_list && (
            <div
              id='candidate_list'
              style={{ width: '100%', backgroundColor: 'white' }}
            >
              <Table
                bordered
                hover
                style={{ width: '100%', height: 'auto', tableLayout: 'fixed' }}
              >
                <tbody>{candidate_rows}</tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CandidateDetails;
