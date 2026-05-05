create database projetoPessoal;

use projetoPessoal;

CREATE TABLE usuario (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(75) UNIQUE,
    senha VARCHAR(25),
    termos TINYINT CHECK(termos = 1)
);
  
SELECT 
    *
FROM
    usuario;

CREATE TABLE partida (
    idPartida INT PRIMARY KEY AUTO_INCREMENT,
    dataPartida DATE NOT NULL,
    tipoPartida VARCHAR(20) NOT NULL
);

CREATE TABLE estatistica (
    idEstatistica INT PRIMARY KEY AUTO_INCREMENT,
    chutesRecebidos INT,
    penaltisPartida INT,
    golsSofridos INT,
    golsPenalti INT,
    fkUsuario INT NOT NULL,
    fkPartida INT NOT NULL UNIQUE,
    FOREIGN KEY (fkUsuario)
        REFERENCES usuario(idusuario),
    FOREIGN KEY (fkPartida)
        REFERENCES partida(idPartida)
);

select * from partida;

select count(*) from partida;

set foreign_key_checks = 1;

truncate estatistica;
truncate partida;
truncate usuario;

select * from usuario;
select * from estatistica;
select * from partida;

show tables;

desc estatistica;