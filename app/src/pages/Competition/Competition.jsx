import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loading, Tabs, LineChart } from 'components';
import { competitionActions, competitionSelectors } from 'redux/competitions';
import { playerActions } from 'redux/players';
import { useUrlContext } from 'hooks';
import { getCompetitionChartData } from 'utils';
import URL from 'utils/url';
import DeleteCompetitionModal from 'modals/DeleteCompetitionModal';
import UpdateAllModal from 'modals/UpdateAllModal';
import { Header, Widgets, ParticipantsTable, TeamsTable } from './containers';
import { CompetitionInfo } from './components';
import { CompetitionContext } from './context';
import './Competition.scss';

function getTabs(competitionType) {
  const tabs = ['Participants Table', 'Top 5 progress chart'];

  if (competitionType === 'team') {
    tabs.unshift('Team standings');
  }

  return tabs;
}

function Competition() {
  const dispatch = useDispatch();
  const router = useHistory();

  const { context, updateContext } = useUrlContext(encodeContext, decodeURL);
  const { id, section } = context;

  const [showUpdateAllModal, setShowUpdateAllModal] = useState(false);

  const competition = useSelector(competitionSelectors.getCompetition(id));
  const competitionType = competition ? competition.type : 'classic';

  const tabs = getTabs(competitionType);
  const chartData = getCompetitionChartData(competition);
  const selectedTabIndex = getSelectedTabIndex(competitionType, section);
  const showDeleteModal = section === 'delete' && !!competition;

  const handleUpdateAll = verificationCode => {
    dispatch(competitionActions.updateAll(id, verificationCode)).then(r => {
      if (!r.payload.error) setShowUpdateAllModal(false);
    });
  };

  const handleUpdatePlayer = username => {
    dispatch(playerActions.trackPlayer(username));
  };

  const handleEditRedirect = () => {
    router.push(`/competitions/${id}/edit`);
  };

  const handleTabSelected = index => {
    if (competitionType === 'classic') {
      updateContext({ section: index === 0 ? 'participants' : 'chart' });
    } else if (index === 0) {
      updateContext({ section: 'teams' });
    } else if (index === 1) {
      updateContext({ section: 'participants' });
    } else {
      updateContext({ section: 'chart' });
    }
  };

  // Fetch competition details, on mount
  useEffect(() => fetchDetails(id, router, dispatch), [router, dispatch, id]);

  useEffect(() => {
    if (competition && competition.type === 'classic' && section === 'teams') {
      router.replace(encodeContext({ id, section: 'participants' }));
    }
  }, [section, id, router, competition]);

  if (!competition) {
    return <Loading />;
  }

  return (
    <CompetitionContext.Provider value={{ context, updateContext }}>
      <Helmet>
        <title>{competition.title}</title>
      </Helmet>
      <div className="competition__container container">
        <div className="competition__header row">
          <div className="col">
            <Header
              competition={competition}
              handleUpdateAll={() => setShowUpdateAllModal(true)}
              handleEditRedirect={handleEditRedirect}
            />
          </div>
        </div>
        <div className="competition__widgets row">
          <Widgets competition={competition} />
        </div>
        <div className="competition__content row">
          <div className="col-md-3">
            <CompetitionInfo competition={competition} />
          </div>
          <div className="col-md-9">
            <Tabs tabs={tabs} selectedIndex={selectedTabIndex} onTabSelected={handleTabSelected} />
            {section === 'teams' && (
              <TeamsTable competition={competition} onUpdateClicked={handleUpdatePlayer} />
            )}
            {section === 'participants' && (
              <ParticipantsTable competition={competition} onUpdateClicked={handleUpdatePlayer} />
            )}
            {section === 'chart' && <LineChart datasets={chartData} />}
          </div>
        </div>
        {showDeleteModal && (
          <DeleteCompetitionModal
            competition={competition}
            onCancel={() => updateContext({ section: 'teams' })}
          />
        )}
        {showUpdateAllModal && (
          <UpdateAllModal
            entityName="competition"
            onCancel={() => setShowUpdateAllModal(false)}
            onSubmit={handleUpdateAll}
          />
        )}
      </div>
    </CompetitionContext.Provider>
  );
}

const fetchDetails = (id, router, dispatch) => {
  // Attempt to fetch competition of that id, if it fails redirect to 404
  dispatch(competitionActions.fetchDetails(id))
    .then(action => {
      if (!action.payload.data) throw new Error();
    })
    .catch(() => router.push('/404'));
};

function getSelectedTabIndex(competitionType, section) {
  if (competitionType === 'classic') {
    return section === 'chart' ? 1 : 0;
  }

  switch (section) {
    case 'participants':
      return 1;
    case 'chart':
      return 2;
    default:
      return 0;
  }
}

function encodeContext({ id, section }) {
  return new URL(`/competitions/${id}/${section}`).getPath();
}

function decodeURL(params) {
  const id = parseInt(params.id, 10);
  const { section } = params;

  // Since these decode/encode functions don't have access to the competition type
  // by default, try to render the "teams" display, and if it isn't a
  // team competition, a useEffect will correct the section to 'participants'
  if (!section) {
    return { id, section: 'teams' };
  }

  return { id, section };
}

export default Competition;
